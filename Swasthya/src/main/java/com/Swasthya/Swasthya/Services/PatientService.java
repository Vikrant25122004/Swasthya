package com.Swasthya.Swasthya.Services;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.Swasthya.Swasthya.Entities.Patient;
import com.Swasthya.Swasthya.Repository.PatientRepositories;

@Service
public class PatientService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @Autowired
    private PatientRepositories patientRepositories;
    @Autowired
    private PasswordEncoder passwordEncoder;
   


    public void register(Patient patient) {
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        patientRepositories.save(patient);

    }
    public Patient gPatient(String patientnumber){
        Patient patient = patientRepositories.findByphonenumber(patientnumber);
        return patient;

    }
    
}
