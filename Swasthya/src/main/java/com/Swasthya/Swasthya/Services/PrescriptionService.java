package com.Swasthya.Swasthya.Services;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import com.Swasthya.Swasthya.Entities.Doctors;
import com.Swasthya.Swasthya.Entities.PastPatients;
import com.Swasthya.Swasthya.Entities.Patient;
import com.Swasthya.Swasthya.Entities.Prescriptions;
import com.Swasthya.Swasthya.Repository.DoctorRepositories;
import com.Swasthya.Swasthya.Repository.PastPatientRepo;
import com.Swasthya.Swasthya.Repository.PatientRepositories;
import com.Swasthya.Swasthya.Repository.Prescriptionrepo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.CMYKColor;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@Service
public class PrescriptionService {
    
    @Autowired
    private PatientRepositories repositories;
    @Autowired
    private Prescriptionrepo prescriptionrepo;
    @Autowired
    private DoctorRepositories doctorRepositories;
    @Autowired
    private PastPatientRepo pastPatientRepo;
    @Autowired
    private MongoTemplate mongoTemplate;

    public Prescriptions getprescription(String doctorname, String prescription , String problem, String patientname){
      
         Patient patiente = repositories.findByphonenumber(patientname);
         Doctors doctorse = doctorRepositories.findByEmail(doctorname);
        try {
           ByteArrayOutputStream bArrayOutputStream = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4, 50, 50, 60, 60); // margins
        PdfWriter.getInstance(document, bArrayOutputStream);
         document.open();

// ====== Company Title ======
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 26, CMYKColor.BLUE);
        Paragraph title = new Paragraph("Swasthya HealthCare", titleFont);
           title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

          document.add(new Paragraph(" ")); // Spacer

// ====== Doctor Name ======
          Font doctorFont = FontFactory.getFont(FontFactory.TIMES_BOLDITALIC, 18, CMYKColor.DARK_GRAY);
        Paragraph doctor = new Paragraph("Dr. " + doctorse.getName(), doctorFont);
            doctor.setAlignment(Element.ALIGN_CENTER);
          document.add(doctor);

          document.add(new Paragraph(" ")); // Spacer

// ====== Problem Title ======
          Font problemFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, CMYKColor.RED);
         Paragraph prob = new Paragraph("Reported Problem: " + problem, problemFont); 
        prob.setAlignment(Element.ALIGN_CENTER);
       document.add(prob);

       document.add(new Paragraph(" ")); // Spacer

// ====== Patient Info Section ======
           Font sectionHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
          Font patientFont = FontFactory.getFont(FontFactory.TIMES_ROMAN, 12);

            PdfPTable patientTable = new PdfPTable(2);
 
           patientTable.setWidthPercentage(100);
           patientTable.setSpacingBefore(10f);
           patientTable.setSpacingAfter(10f);
           patientTable.setWidths(new float[]{1f, 3f});

// Patient Name Row
           patientTable.addCell(new Phrase("Patient Name:", sectionHeaderFont));
           patientTable.addCell(new Phrase(patiente.getName(), patientFont));

          document.add(patientTable);

// ====== Prescription Section ======
          Font prescriptionHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, CMYKColor.BLACK);
           Paragraph prescriptionTitle = new Paragraph(prescription, prescriptionHeader);
          prescriptionTitle.setAlignment(Element.ALIGN_CENTER);
          document.add(prescriptionTitle);

          document.add(new Paragraph(" ")); // Spacer

           Font prescriptionFont = FontFactory.getFont(FontFactory.TIMES_BOLD, 12);
           Paragraph prescriptionText = new Paragraph(patientname, prescriptionFont);
          prescriptionText.setAlignment(Element.ALIGN_LEFT);
          document.add(prescriptionText);

// ====== Footer ======
          document.add(new Paragraph(" "));
          Font footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, CMYKColor.GRAY);
          Paragraph footer = new Paragraph("Generated by Swasthya System", footerFont);
          footer.setAlignment(Element.ALIGN_CENTER);
           document.add(footer);

            document.close();
              RazorpayClient client = new RazorpayClient("rzp_test_qaKBNUQeP8i9yL", "r6W1eP5KxULG5LIFkVd4cuVQ");
            JSONObject object = new JSONObject();
            object.put("amount",doctorse.getFees());
            object.put("currency", "INR");
            object.put("receipt", LocalDateTime.now());
            Order order = client.orders.create(object);
            Prescriptions prescrips = new Prescriptions();
          prescrips.setDoctorname(doctorse.getName());
          prescrips.setPatientname(patientname);
          prescrips.setProblem(problem);
          prescrips.setPrescriptionbyte(bArrayOutputStream.toByteArray());
          prescrips.setDoctoremail(doctorname);
          prescrips.setOrderid(order.get("id"));
          String or = order.get("id");
          System.out.println(prescrips.getOrderid());
          System.out.println(or);
          System.out.println();
          prescrips.setAmount(doctorse.getFees());
          prescriptionrepo.save(prescrips);
          PastPatients pastPatients = new PastPatients();
          pastPatients.setDoctoremail(doctorname);
          pastPatients.setDoctorname(doctorse.getName());
          pastPatients.setPatientname(patiente.getName());
          pastPatients.setPatientemail(patientname);
          pastPatients.setPrescripbyte(prescrips.getPrescriptionbyte());
          pastPatients.setPrescripname(prescrips.getPrescriptionname());
          pastPatients.setPrescriptype(prescrips.getPrescriptiontype());
          pastPatients.setProblem(problem);
          pastPatients.setRatings(0);

          System.out.println(pastPatients.getRatings());

          pastPatientRepo.save(pastPatients);
            return prescrips;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean makepaymentt(String orderid){
        Prescriptions prescriptions = prescriptionrepo.findByorderid(orderid);
        try {
            prescriptions.setPaid(true);
            System.out.println(prescriptions.getOrderid());
            String phonenumber = prescriptions.getPatientname();
            String doctormail = prescriptions.getDoctoremail();
            Query query = new Query();
            query.addCriteria(Criteria.where("doctoremail").is(doctormail).and("patientemail").is(phonenumber));
            List<PastPatients> pastPatients = mongoTemplate.find(query, PastPatients.class);
            PastPatients pastPatients2 = pastPatients.get(pastPatients.size()-1);
            pastPatients2.setPaid(true);
            pastPatientRepo.save(pastPatients2);
            prescriptionrepo.save(prescriptions);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }

    public List<Prescriptions> gethistory(String phonenumber){
      Query query = new Query();
      query.addCriteria(Criteria.where("patientname").is(phonenumber));
    
      List<Prescriptions> prescriptions = mongoTemplate.find(query,Prescriptions.class);
      return prescriptions;
      

    }
    public boolean checkk(String phonenumber){
       Query query = new Query();
      query.addCriteria(Criteria.where("patientname").is(phonenumber));
    
      List<Prescriptions> prescriptions = mongoTemplate.find(query,Prescriptions.class);
      for(int i= 0;i<prescriptions.size();i++){
        if(prescriptions.get(i).isPaid()==false){
          return false;
        }
      }
      return true;
     

    }
    public String analyse(String base64url) throws Exception {
    String base64Pdf = base64url;

    Map<String, Object> jsonBody = new HashMap<>();
    Map<String, Object> inlineData = new HashMap<>();
    inlineData.put("mime_type", "application/pdf");
    inlineData.put("data", base64Pdf);

    Map<String, Object> partPdf = new HashMap<>();
    partPdf.put("inline_data", inlineData);

    Map<String, Object> partPrompt = new HashMap<>();
    partPrompt.put("text", "provide me the summary of a problem and prescription and tell me is doctor correct acc to problem and make your response in 5 to 6 bold points only");

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

    return textNode.asText().replace("*","");
}


    
}
