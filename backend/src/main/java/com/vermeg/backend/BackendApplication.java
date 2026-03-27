package com.vermeg.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

    // نزيدو هذي باش نكلمو الـ Flask (Python)
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}