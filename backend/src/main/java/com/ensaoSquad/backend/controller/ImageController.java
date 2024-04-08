package com.ensaoSquad.backend.controller;

import com.ensaoSquad.backend.model.Student;
import com.ensaoSquad.backend.repository.StudentRepository;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
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

    @PostMapping("/upload")
    public String uploadFiles(@RequestParam("files") List<MultipartFile> files,
                              RedirectAttributes redirectAttributes) {
        System.out.println("Upload endpoint reached.");

        // Check if files were provided
        if (files == null || files.isEmpty()) {
            redirectAttributes.addFlashAttribute("message", "Please select files to upload.");
            return "redirect:/uploadStatus";
        }

        try {
            // Create the directory if it doesn't exist
            Path directoryPath = Paths.get(UPLOADED_FOLDER);
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }

            // Iterate over each uploaded file and save it
            for (MultipartFile file : files) {
                byte[] bytes = file.getBytes();
                Path path = Paths.get(UPLOADED_FOLDER + file.getOriginalFilename());
                Files.write(path, bytes);
            }
            redirectAttributes.addFlashAttribute("message", "Files uploaded successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("message", "Failed to upload files.");
        }

        return "redirect:/uploadStatus";
    }

    @GetMapping("/image")
    public ResponseEntity<Resource> getImage(@RequestParam("name")long apogee) {
        // Retrieve the student details from the database based on their name
        Student student = studentRepository.findByApogee(apogee);
        if (student == null) {
            return ResponseEntity.notFound().build(); // Student not found
        }

        // Construct the file path for the student's image using their apogee
        String fileName = student.getApogee() + ".jpg";
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


}
