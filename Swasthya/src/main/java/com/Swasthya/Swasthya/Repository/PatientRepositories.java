package com.Swasthya.Swasthya.Repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Swasthya.Swasthya.Entities.Patient;

@Repository
public interface PatientRepositories extends MongoRepository<Patient,ObjectId>{
    Patient findByEmail(String email);
    Patient findByphonenumber(String phonenumber);
    
}
