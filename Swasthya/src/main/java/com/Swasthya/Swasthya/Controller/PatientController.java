package com.Swasthya.Swasthya.Controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.Swasthya.Swasthya.Entities.Doctors;
import com.Swasthya.Swasthya.Entities.Patient;
import com.Swasthya.Swasthya.Entities.Prescriptions;
import com.Swasthya.Swasthya.Entities.VideoCallNotification;
import com.Swasthya.Swasthya.Repository.DoctorRepositories;
import com.Swasthya.Swasthya.Services.DoctorService;
import com.Swasthya.Swasthya.Services.PatientService;
import com.Swasthya.Swasthya.Services.PrescriptionService;
import com.Swasthya.Swasthya.Services.ratingsService;
import com.Swasthya.Swasthya.Utils.Jwtutils;
import com.fasterxml.jackson.databind.ObjectMapper;

@RequestMapping("/patient")
@RestController
public class PatientController {
     

     @Autowired
     private DoctorRepositories doctorRepositories;
     @Autowired
     private PatientService patientService;
     @Autowired
     private ratingsService ratingsService;
     @Autowired
     private PrescriptionService prescriptionService;
     @Autowired
    private SimpMessagingTemplate messagingTemplate;

     @PostMapping("/getpatient")
     public ResponseEntity<?> getpatient() {
         
         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
         String username = authentication.getName();
         Patient patient = patientService.gPatient(username);
        try {
          return new ResponseEntity<>(patient,HttpStatus.OK);
        } catch (Exception e) {
          e.printStackTrace();
          return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
          // TODO: handle exception
        }
     }
     
     @PostMapping("/setratings")
     public ResponseEntity<?> setratings(@RequestParam String doctoremail,@RequestParam int ratings) {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      String username = authentication.getName();
      System.out.println(ratings);
      try {
       if(ratingsService.setratings(doctoremail, ratings, username)){
        return new ResponseEntity<>(HttpStatus.OK);
       }
       else{
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
       }

        
      } catch (Exception e) {
        
        e.printStackTrace();
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
               
     }
     
@PostMapping("/notifyVideoCall")
public ResponseEntity<?> notifyVideoCall(@RequestBody VideoCallNotification notification) {
  Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
  String username = authentication.getName();
  if (prescriptionService.checkk(username)) {

  
    Patient patient = patientService.gPatient(notification.getPatientPhonenumber());
    notification.setPatientName(patient.getPhonenumber());
    // Notify over WebSocket
    String topic = "/topic/" + notification.getDoctorEmail();
    messagingTemplate.convertAndSend(topic, notification);
    System.out.println(notification + notification.getDoctorEmail());
    // messagingTemplate is @Autowired SimpMessagingTemplate

    return ResponseEntity.ok("Notification sent");
  
}
else{
  return new ResponseEntity<>("pay your previous prescriptions first",HttpStatus.BAD_REQUEST);
}
}

@PostMapping("/makepayment")
public ResponseEntity<?> postMethodName(@RequestBody String orderid) {
    //TODO: process POST request
    try {
          prescriptionService.makepaymentt(orderid);
          return new ResponseEntity<>(HttpStatus.OK);

    } catch (Exception e) {
      // TODO: handle exception
      e.printStackTrace();

      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

@PostMapping("/gethistorycheckups")
public ResponseEntity<?> gethistory() {
    //TODO: process POST request
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();
    try {
      List<Prescriptions> prescriptions = prescriptionService.gethistory(username);
      
      return new ResponseEntity<>(prescriptions.reversed(),HttpStatus.OK);
    } catch (Exception e) {
      // TODO: handle exception
      e.printStackTrace();
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
}

@PostMapping("/analyseprescription")
public ResponseEntity<?> analyseprescription(@RequestBody String pdfbase64) {
    

  Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
  String username = authentication.getName();
  try {
    String response = prescriptionService.analyse(pdfbase64);
    return new ResponseEntity<>(response,HttpStatus.OK);

    
  } catch (Exception e) {
    // TODO: handle exception
    e.printStackTrace();
    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
  }
    
    
}




   



    
}
