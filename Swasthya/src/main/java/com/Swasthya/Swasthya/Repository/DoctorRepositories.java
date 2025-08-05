package com.Swasthya.Swasthya.Repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Swasthya.Swasthya.Entities.Doctors;

@Repository
public interface DoctorRepositories extends MongoRepository<Doctors,ObjectId> {
    Doctors findByEmail(String email);
    
}
