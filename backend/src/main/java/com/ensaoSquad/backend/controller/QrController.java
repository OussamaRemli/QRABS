package com.ensaoSquad.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@RequestMapping("/Qr")
@CrossOrigin("*")
public class QrController {
    @GetMapping("/scan/{sessionId}/{levelId}/{group}/{code}")
    public String scanCodeQr(@PathVariable long sessionId, @PathVariable long levelId,@PathVariable String group ,@PathVariable String code , HttpServletResponse response) {
        return "redirect:/index.html?sessionId=" + sessionId + "&levelId=" + levelId + "&group=" + group + "&code=" + code;
    }

}
