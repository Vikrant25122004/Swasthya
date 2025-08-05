package com.Swasthya.Swasthya.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.Swasthya.Swasthya.Entities.Doctors;
import com.Swasthya.Swasthya.Entities.Patient;
import com.Swasthya.Swasthya.Entities.Prescriptions;
import com.Swasthya.Swasthya.Entities.SignalingMessage;
import com.Swasthya.Swasthya.Entities.VideoCallNotification;
import com.Swasthya.Swasthya.Repository.DoctorRepositories;
import com.Swasthya.Swasthya.Services.Appauth;
import com.Swasthya.Swasthya.Services.DoctorService;
import com.Swasthya.Swasthya.Services.PatientService;
import com.Swasthya.Swasthya.Services.PrescriptionService;
import com.Swasthya.Swasthya.Utils.Jwtutils;
import com.lowagie.text.Document;

import lombok.Synchronized;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.message.SimpleMessage;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@Slf4j// Adjust the origin as needed
@RequestMapping("/public")
public class PublicController {


    private static final org.slf4j.Logger logger = LoggerFactory.getLogger(PublicController.class);


    @Autowired
    private DoctorService doctorService;
    @Autowired
    private PatientService patientService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private DoctorRepositories doctorRepositories;
    @Autowired
    private Appauth appauth;
    @Autowired
    private Jwtutils jwtutils;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    @Autowired
    private PrescriptionService prescriptionService;

    

    @PostMapping("/registerDoctor")
    public ResponseEntity<?> registerdoctor(@RequestPart Doctors doctors, @RequestPart MultipartFile pdfFile, @RequestPart MultipartFile profilepic){
        try {
            doctorService.register(doctors,pdfFile, profilepic );
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            // TODO: handle exception
        }
    
    }
    
    
    @PostMapping("/registerPatient")
    public ResponseEntity<?> registerpatient(@RequestBody Patient patient) {
        //TODO: process POST request
        try {
            patientService.register(patient);
            return new ResponseEntity<>(HttpStatus.OK);
            
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        
    }
    
     @PostMapping("/login-doctor")
    public ResponseEntity<String> login(@RequestBody Doctors doctors) {
        try{
           authenticationManager.authenticate( new UsernamePasswordAuthenticationToken(doctors.getEmail(), doctors.getPassword()));
            UserDetails userDetails = appauth.loadUserByUsername(doctors.getEmail());
            String jwt = jwtutils.generateToken(userDetails.getUsername());
            Doctors doctors2 = doctorService.getdoctors(doctors.getEmail());
            doctors2.setStatus("online");
            doctors2.setBook(false);
            doctorRepositories.save(doctors2);
            sendDoctors();

            
            logger.info("Customer login successful for username: {}", doctors.getEmail());
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        }catch (Exception e){
            logger.error("Customer login error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect username or password");
            // Add logging here!
        }

    }
    
     @PostMapping("/login-patient")
    public ResponseEntity<String> loginpatient(@RequestBody Patient patient) {
        try{
            System.out.println(patient.getPhonenumber());
           authenticationManager.authenticate( new UsernamePasswordAuthenticationToken(patient.getPhonenumber(), patient.getPassword()));
            UserDetails userDetails = appauth.loadUserByUsername(patient.getPhonenumber());
            String jwt = jwtutils.generateToken(userDetails.getUsername());
            sendDoctors();

            logger.info("Customer login successful for username: {}", patient.getEmail());
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        }catch (Exception e){
            logger.error("Customer login error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect username or password");
            // Add logging here!
        }

    }
    
    @GetMapping("/subscribe")
      public SseEmitter subscribe() {
    // Validate token here before accepting connection
   
    SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
    emitters.add(emitter);
    emitter.onCompletion(() -> emitters.remove(emitter));
    emitter.onTimeout(() -> emitters.remove(emitter));
   sendDoctors();

    return emitter;
      }


    @PostMapping("/sendDoctors")
     public ResponseEntity<String> sendDoctors() {
     List<Doctors> doctors = doctorService.getOnlineDoctors(); // your method to get list
     System.out.println(doctors.size());
    for (SseEmitter emitter : emitters) {
        try {
            emitter.send(SseEmitter.event()
                .id(UUID.randomUUID().toString())
                .name("doctorsList")
                .data(doctors));  // Spring converts to JSON automatically
        } catch (IOException e) {
            emitters.remove(emitter);
        }
    }
    return ResponseEntity.ok("Doctors list sent!");
    }

    @PostMapping("/offline")
    public ResponseEntity<?> makeonline(@RequestBody String email) {
        System.out.println(email);
       
       try {
        Doctors sDoctors = doctorRepositories.findByEmail(email);
        sDoctors.setStatus("offline");
        doctorRepositories.save(sDoctors);
        sendDoctors();
        return new ResponseEntity<>(HttpStatus.OK);

       } catch (Exception e) {
        // TODO: handle exception
        e.printStackTrace();
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
       }
       
    }

    @PostMapping("/analysedegree")
    public ResponseEntity<?> degreeanalyse(@RequestBody String base64url) {
        //TODO: process POST request
        try {
            String degreecheck = doctorService.checkkk(base64url);
        if (degreecheck.equals("true")||degreecheck.equals("True")) {
            return new ResponseEntity<>(HttpStatus.OK);
            
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
        
        
    }
    
   // Controller



}
