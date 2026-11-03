package com.sridevisarees.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;

@SpringBootTest(properties = {
    "app.jwt.secret=TestJwtSecretKeyForRunningUnitAndIntegrationTestsSecurely256BitsLong!"
})
@ActiveProfiles("test")
@TestExecutionListeners({
    DependencyInjectionTestExecutionListener.class,
    DirtiesContextTestExecutionListener.class
})
class SrideviBackendApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring application context initializes cleanly with validated configuration
    }
}
