package com.ensaoSquad.backend.service.impl;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class PasswordResetService {

    private Map<String, String> verificationCodes = new HashMap<>();

    public String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    public Map<String, String> getVerificationCodes() {
        return verificationCodes;
    }}

