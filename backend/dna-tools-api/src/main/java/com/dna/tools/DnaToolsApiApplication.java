package com.dna.tools;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class DnaToolsApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(DnaToolsApiApplication.class, args);
	}

}
