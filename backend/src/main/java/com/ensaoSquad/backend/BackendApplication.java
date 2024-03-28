package com.ensaoSquad.backend;

import org.apache.poi.ss.formula.functions.TimeValue;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.sql.Time;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

		SpringApplication.run(BackendApplication.class, args);
		System.out.println(Time.valueOf("8:30:00"));

	}

}
