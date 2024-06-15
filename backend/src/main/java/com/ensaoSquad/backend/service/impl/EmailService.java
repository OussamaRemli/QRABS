package com.ensaoSquad.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public boolean sendEmail(String to, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            mailSender.send(message);
            return true;  // Retourne true si l'e-mail est envoyé avec succès
        } catch (MailException e) {
            // Log l'erreur ou la gérer comme vous le souhaitez
            return false;  // Retourne false si l'envoi de l'e-mail échoue
        }
    }


    public String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

}
