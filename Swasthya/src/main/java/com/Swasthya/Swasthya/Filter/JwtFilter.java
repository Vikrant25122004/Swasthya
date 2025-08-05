package com.Swasthya.Swasthya.Filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import com.Swasthya.Swasthya.Services.Appauth;
import com.Swasthya.Swasthya.Utils.Jwtutils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Service
public class JwtFilter extends OncePerRequestFilter{


    @Autowired
    private Jwtutils jwtUtils;
    
    @Autowired
    private Appauth appUserDetailsService;


    @Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

    String authorizationHeader = request.getHeader("Authorization");
    String username = null;
    String jwt = null;

    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
        jwt = authorizationHeader.substring(7);
        username = jwtUtils.extractUsername(jwt);
        System.out.println("JWT received: " + jwt);
        System.out.println("Username extracted: " + username);
    }

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        try {
            UserDetails userDetails = this.appUserDetailsService.loadUserByUsername(username);
            if (jwtUtils.validateToken(jwt)) { // or jwtUtils.validateToken(jwt, userDetails)
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            System.err.println("JWT filter error: " + e.getMessage());
        }
    }

    filterChain.doFilter(request, response);
}
}
