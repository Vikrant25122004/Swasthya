package com.Swasthya.Swasthya.Services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.Swasthya.Swasthya.Entities.Doctors;
import com.Swasthya.Swasthya.Entities.PastPatients;
import com.Swasthya.Swasthya.Repository.DoctorRepositories;
import com.Swasthya.Swasthya.Repository.PastPatientRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepositories doctorRepositories;
    @Autowired
    private PasswordEncoder passwordEncoder;
     @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private PastPatientRepo pastPatientRepo;

    public void register(Doctors doctors, MultipartFile pdfFile, MultipartFile profilepic) throws IOException {
        // TODO Auto-generated method stub
        doctors.setDegreepdfname(pdfFile.getOriginalFilename());
        doctors.setDegreepdftype(pdfFile.getContentType());
        doctors.setDegreepdfbyte(pdfFile.getBytes());
        doctors.setProfilepicname(profilepic.getOriginalFilename());
        doctors.setProfilepictype(profilepic.getContentType());
        doctors.setProfilepicbyte(profilepic.getBytes());
        doctors.setPassword(passwordEncoder.encode(doctors.getPassword()));
        doctorRepositories.save(doctors);
        
        
    }

    public void update(Doctors doctors,String username) {
        Doctors doctors2 = doctorRepositories.findByEmail(username);
        if (doctors.getEmail()!=null) {
            doctors2.setEmail(doctors.getEmail());
            
        }
        if (doctors.getName()!=null) {
            doctors2.setName(doctors.getName());
            
        }
        if (doctors.getAddress()!=null) {
            doctors2.setAddress(doctors.getAddress());
            
        }
        if (doctors.getExperience()!=null) {
            doctors2.setExperience(doctors.getExperience());
            
        }
        if (doctors.getFees()!=null) {
            doctors2.setFees(doctors.getFees());
            
        }
        if (doctors.getPassword()!=null) {
            doctors2.setPassword(passwordEncoder.encode(doctors.getPassword()));
            
        }
        if(doctors.getHospital_Clinic_name()!=null){
            doctors2.setHospital_Clinic_name(doctors.getHospital_Clinic_name());
        }
        if(doctors.getPhonenumber()!=null){
            doctors2.setPhonenumber(doctors.getPhonenumber());
        }
        if (doctors.getSpeciality()!=null) {
            doctors2.setSpeciality(doctors.getSpeciality());
            
        }
        doctorRepositories.save(doctors2);
        
    }
    public Doctors getdoctors(String email){
        Doctors doctors = doctorRepositories.findByEmail(email);
        return doctors;
    }

    public List<Doctors> getOnlineDoctors() {
        // TODO Auto-generated method stub
        Query query = new Query();
        query.addCriteria(Criteria.where("status").is("online"));
        List<Doctors> doctors = mongoTemplate.find(query, Doctors.class);
        return doctors;
    }

    public List<PastPatients> gPatients(String doctoremail){
        List<PastPatients> pastPatients = pastPatientRepo.findByDoctoremail(doctoremail);
        return pastPatients.reversed();

    }

    public String checkkk(String base64url) throws JsonMappingException, JsonProcessingException {
        
    String base64Pdf = base64url;

    Map<String, Object> jsonBody = new HashMap<>();
    Map<String, Object> inlineData = new HashMap<>();
    inlineData.put("mime_type", "application/pdf");
    inlineData.put("data", base64Pdf);

    Map<String, Object> partPdf = new HashMap<>();
    partPdf.put("inline_data", inlineData);

    Map<String, Object> partPrompt = new HashMap<>();
    partPrompt.put("text", "i am providing you the pdf of a medical document you have to tell in true or false if the this is a valid medical docs than you have to say true otherwise false............. if the chance of getting true is more than 50 percent than you have to say true otherwise false and i want ans in just one word not more than one word in response");

    List<Object> parts = new ArrayList<>();
    parts.add(partPdf);
    parts.add(partPrompt);

    Map<String, Object> content = new HashMap<>();
    content.put("parts", parts);

    List<Object> contentsList = new ArrayList<>();
    contentsList.add(content);

    jsonBody.put("contents", contentsList);

    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(jsonBody, headers);

    String urlGemini =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAQEV5lsMgF7S-5AuHsGK4xowkBaVhvbTY"; // Replace with your API key

    ResponseEntity<String> aiResponse = restTemplate.exchange(
        urlGemini, HttpMethod.POST, entity, String.class);

    // Parse JSON and extract text
    ObjectMapper mapper = new ObjectMapper();
    JsonNode rootNode = mapper.readTree(aiResponse.getBody());
    JsonNode textNode = rootNode.path("candidates")
                                .get(0)
                                .path("content")
                                .path("parts")
                                .get(0)
                                .path("text");

    System.out.println(textNode.asText().replace("*", ""));
    return textNode.asText().replace("*","");
    }
}
