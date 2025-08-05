package com.Swasthya.Swasthya.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Swasthya.Swasthya.Entities.Doctors;
import com.Swasthya.Swasthya.Entities.PastPatients;
import com.Swasthya.Swasthya.Entities.Prescriptions;
import com.Swasthya.Swasthya.Repository.DoctorRepositories;
import com.Swasthya.Swasthya.Services.DoctorService;
import com.Swasthya.Swasthya.Services.PrescriptionService;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.PostMapping;




@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;
    @Autowired
    private DoctorRepositories doctorRepositories;
    @Autowired
    private PrescriptionService prescriptionService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    @PutMapping("/update")
    public ResponseEntity<?> updatedoctor(@RequestBody Doctors doctors) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            doctorService.update(doctors,username);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/getDoctor")
    public ResponseEntity<?> getdoctor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            Doctors doctors = doctorService.getdoctors(username);
            return new ResponseEntity<>(doctors,HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            // TODO: handle exception
        }
    }
    
    @PostMapping("/deductcall")
    public ResponseEntity<?> postMethodName(@RequestBody String email) {
        Doctors doctors = doctorRepositories.findByEmail(email);
        doctors.setBook(false);
        doctorRepositories.save(doctors);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    
    @GetMapping("/getpic")
    public ResponseEntity<?> getMethodName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Doctors doctors = doctorRepositories.findByEmail(username);
        String name = doctors.getProfilepicname();
        String typee = doctors.getProfilepictype();
        return ResponseEntity.ok().contentType(MediaType.valueOf(typee)).body(doctors.getProfilepicbyte());

                
    }


     @PostMapping("/uploadpic")
    public ResponseEntity<?> postMethodName(@RequestPart MultipartFile img) throws IOException {

       Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
       String username = authentication.getName();
       Doctors doctors = doctorRepositories.findByEmail(username);
       doctors.setProfilepicname(img.getOriginalFilename());
       doctors.setProfilepictype(img.getContentType());
       doctors.setProfilepicbyte(img.getBytes());
       doctorRepositories.save(doctors);
       System.out.println(img.getContentType());
        
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/getdegree")
    public ResponseEntity<?> degreee() {

         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Doctors doctors = doctorRepositories.findByEmail(username);
        String name = doctors.getDegreepdfname();
        String typee = doctors.getDegreepdftype();
        return ResponseEntity.ok().contentType(MediaType.valueOf(typee)).body(doctors.getDegreepdfbyte());

           
    }
    
    @PostMapping("/updatepdf")
    public ResponseEntity<?> updatepdff(@RequestPart MultipartFile degreepdf) throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Doctors doctors = doctorRepositories.findByEmail(username);
        doctors.setDegreepdfbyte(degreepdf.getBytes());
        doctors.setDegreepdfname(degreepdf.getOriginalFilename());
        doctors.setDegreepdftype(degreepdf.getContentType());
        doctorRepositories.save(doctors);
        
        
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
  
@PostMapping("/prescriptions")
public ResponseEntity<?> prescription(@RequestPart String prescription, @RequestPart String doctoremail,@RequestPart String patientnumber,@RequestPart String problem) {
    //TODO: process POST request
    System.out.println(patientnumber);
    System.out.println(prescription);
    System.out.println(doctoremail);
    System.out.println(problem);
    String topic = "/topic/"+ patientnumber;
    Prescriptions pred = prescriptionService.getprescription(doctoremail, prescription, problem, patientnumber);

    messagingTemplate.convertAndSend(topic,pred);
    
    return new ResponseEntity<>(prescription,HttpStatus.OK);
}

@PostMapping("/pastpatient")
public ResponseEntity<?> getpastpatient() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();
    try {
        List<PastPatients> pastPatients = doctorService.gPatients(username);
        return new ResponseEntity<>(pastPatients,HttpStatus.OK);
    } catch (Exception e) {
        e.printStackTrace();
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        // TODO: handle exception
    }
}

    
}
