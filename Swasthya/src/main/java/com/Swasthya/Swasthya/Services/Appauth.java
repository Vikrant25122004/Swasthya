package com.Swasthya.Swasthya.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Swasthya.Swasthya.Entities.Doctors;
import com.Swasthya.Swasthya.Entities.Patient;
import com.Swasthya.Swasthya.Repository.DoctorRepositories;
import com.Swasthya.Swasthya.Repository.PatientRepositories;

@Service
public class Appauth implements UserDetailsService {

    @Autowired
    private DoctorRepositories doctorRepositories;

    @Autowired
    private PatientRepositories patientRepositories;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (username == null || username.trim().isEmpty()) {
            throw new UsernameNotFoundException("Username is empty");
        }

        if (username.contains("@")) { // Treat as doctor email
            Doctors doctor = doctorRepositories.findByEmail(username);
            if (doctor != null) {
                if (doctor.getPassword() == null) {
                    throw new UsernameNotFoundException("Doctor's password not set");
                }
                return User.builder()
                    .username(doctor.getEmail())
                    .password(doctor.getPassword())
                    // no roles assigned here
                    .build();
            }
        } else { // Treat as patient phone number
            Patient patient = patientRepositories.findByphonenumber(username);
            if (patient != null) {
                if (patient.getPassword() == null) {
                    throw new UsernameNotFoundException("Patient's password not set");
                }
                return User.builder()
                    .username(patient.getPhonenumber())
                    .password(patient.getPassword())
                    // no roles assigned here
                    .build();
            }
        }

        throw new UsernameNotFoundException("User not found with identifier: " + username);
    }
}
