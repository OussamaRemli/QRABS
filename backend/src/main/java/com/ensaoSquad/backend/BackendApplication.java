package com.ensaoSquad.backend;

import com.ensaoSquad.backend.model.Professor;
import io.github.cdimascio.dotenv.Dotenv;
import org.apache.poi.ss.formula.functions.TimeValue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.sql.Time;


@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

		// Charger les variables d'environnement à partir de .env
		Dotenv dotenv = Dotenv.configure().load();

		// Mettre les variables d'environnement dans les propriétés système
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));


		SpringApplication.run(BackendApplication.class, args);



		System.out.println(Time.valueOf("8:30:00"));

	}

}
