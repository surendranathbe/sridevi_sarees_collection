package com.sridevisarees.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "spring.data.mongodb.uri=mongodb://localhost:27017"
})
class SrideviBackendApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring application context initializes cleanly
    }
}
