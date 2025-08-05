package com.Swasthya.Swasthya.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.Swasthya.Swasthya.Entities.Doctors;
import com.Swasthya.Swasthya.Entities.PastPatients;
import com.Swasthya.Swasthya.Entities.Patient;
import com.Swasthya.Swasthya.Repository.DoctorRepositories;
import com.Swasthya.Swasthya.Repository.PastPatientRepo;
import com.Swasthya.Swasthya.Repository.PatientRepositories;

@Service
public class ratingsService {

    @Autowired
    private DoctorRepositories doctorRepositories;
    @Autowired
    private PatientRepositories patientRepositories;
    @Autowired
    private PastPatientRepo pastPatientRepo;
    @Autowired 
    private MongoTemplate mongoTemplate;

    public boolean setratings(String doctoremail,int ratings, String patientemail){
        try {
            Doctors doctors = doctorRepositories.findByEmail(doctoremail);
            Query query = new Query();
            query.addCriteria(Criteria.where("doctoremail").is(doctoremail));
            List<PastPatients> pastPatientss = mongoTemplate.find(query,PastPatients.class);
            float rrr=0;
            for(int i=0;i<pastPatientss.size();i++){
                rrr= rrr + pastPatientss.get(i).getRatings();
            }
            rrr =rrr+ratings;
            rrr= rrr/pastPatientss.size();
            doctors.setRatings(rrr);
            System.out.println(doctors.getRatings());
            doctorRepositories.save(doctors);
            Query query2 = new Query();
            query2.addCriteria(Criteria.where("patientemail").is(patientemail));
            List<PastPatients> pList = mongoTemplate.find(query2,PastPatients.class);
            pList.get(pList.size()-1).setRatings(ratings);
            pastPatientRepo.save(pList.get(pList.size()-1));
            return true;

        } catch (Exception e) {
            // TODO: handle exception
            return false;
        }
    }
    
}
