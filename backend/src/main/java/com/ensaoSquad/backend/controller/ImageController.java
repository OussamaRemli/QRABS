package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.model.Student;
import com.ensaoSquad.backend.repository.StudentRepository;
import org.python.core.PyException;
import org.python.util.PythonInterpreter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Controller
@RequestMapping("/api/import-files")
@CrossOrigin(origins = "*")
public class ImageController {

    private static String UPLOADED_FOLDER = "src/main/resources/students-images/";

    @Autowired
    private StudentRepository studentRepository;

    @Value("${flask_url}")
    private String flaskUrl;



    @GetMapping("/image/{apogee}")
    public ResponseEntity<Resource> getImage(@PathVariable long apogee) {
        // Retrieve the student details from the database based on their name
        Student student = studentRepository.findByApogee(apogee);
        if (student == null) {
            return ResponseEntity.notFound().build(); // Student not found
        }

        // Construct the file path for the student's image using their apogee
        String fileName = student.getApogee() + "-" + student.getLevel().getLevelId() + ".jpg";
        Path imagePath = Paths.get(UPLOADED_FOLDER + fileName);

        try {
            // Load the image file
            Resource resource = new UrlResource(imagePath.toUri());

            // Check if the image file exists
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build(); // Image file not found
            }

            // Return the image file
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build(); // Error loading image
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFiles(@RequestParam("files") MultipartFile[] files, RedirectAttributes redirectAttributes) {
        if (files == null || files.length == 0) {
            redirectAttributes.addFlashAttribute("message", "Veuillez sélectionner des fichiers à télécharger.");
            return new ResponseEntity<>("Error", HttpStatus.BAD_REQUEST);        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            for (MultipartFile file : files) {
                // Vérification de l'extension du fichier
                String originalFilename = file.getOriginalFilename();


                // Extraction de l'apogee à partir du nom du fichier
                String[] parts = originalFilename.split("\\.");
                long apogee = Long.parseLong(parts[0]);

                // Recherche de l'étudiant par apogee
                Student student = studentRepository.findByApogee(apogee);
                if (student == null) {
                    redirectAttributes.addFlashAttribute("message", "Étudiant non trouvé pour l'apogee " + apogee);
                    return new ResponseEntity<>("Étudiant non trouvé pour l'apogee", HttpStatus.BAD_REQUEST);
                }

                // Récupération du levelId depuis l'objet Student
                long levelId = student.getLevel().getLevelId(); // Vérifiez la méthode appropriée pour obtenir le levelId

                // Nouveau nom de fichier avec apogee-levelId.jpg
                String newFileName = apogee + "-" + levelId + ".jpg";
                Path filePath = Paths.get(UPLOADED_FOLDER + newFileName);

                // Stockage du fichier renommé
                Files.write(filePath, file.getBytes());
                body.add("files", new FileSystemResource(filePath.toFile()));

                // Debug - Afficher le nouveau nom de fichier
                System.out.println("Nouveau nom de fichier : " + newFileName);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            String pythonScriptUrl = flaskUrl+"/process";
            ResponseEntity<String> response = restTemplate.exchange(pythonScriptUrl, HttpMethod.POST, requestEntity, String.class);

            System.out.println(response.getBody());

            redirectAttributes.addFlashAttribute("message", "Fichiers téléchargés et traités avec succès !");
            return new ResponseEntity<>("ichiers téléchargés et traités avec succès !", HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("message", "Échec du téléchargement des fichiers.");
        }

        return new ResponseEntity<>("Error", HttpStatus.BAD_REQUEST);
    }





}
