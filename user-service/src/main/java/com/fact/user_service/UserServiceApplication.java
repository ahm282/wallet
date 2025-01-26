package com.fact.user_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


//@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
//@SpringBootApplication(scanBasePackages = "com.fact.user_service")
@SpringBootApplication
public class UserServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

}
