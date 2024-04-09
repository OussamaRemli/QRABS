package com.ensaoSquad.backend.service;

import org.springframework.http.ResponseEntity;

public interface AbsenceService {
    public void markPresnt(long seanceId , long studentId , long levelId);
    public void markAbsent(long idSeance , long levelId);


}
