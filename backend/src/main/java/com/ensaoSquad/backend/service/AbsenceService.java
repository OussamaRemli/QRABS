package com.ensaoSquad.backend.service;

public interface AbsenceService {
    public void markPresnt(long seanceId , long studentId , long levelId);
    public void markAbsent(long idSeance , long levelId);


}
