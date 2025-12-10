package com.project.controller;

import com.project.dto.LicenseDto;
import com.project.dto.ReminderRequest;
import com.project.service.AlertsService;
import com.project.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertsController {

    private final AlertsService alertsService;
    private final EmailService emailService;

    public AlertsController(AlertsService alertsService, EmailService emailService) {
        this.alertsService = alertsService;
        this.emailService = emailService;
    }

    @GetMapping("/expiring-licenses")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT_OFFICER', 'COMPLIANCE_OFFICER', 'IT_AUDITOR')")
    public ResponseEntity<List<LicenseDto>> getExpiringLicenses(@RequestParam(defaultValue = "30") int days) {
        List<LicenseDto> licenses = alertsService.getExpiringLicenses(days);
        return ResponseEntity.ok(licenses);
    }

    @PostMapping("/send-reminder")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROCUREMENT_OFFICER')")
    public ResponseEntity<Void> sendReminder(@RequestBody ReminderRequest request) {
        LicenseDto license = request.getLicense();
        String to = request.getEmail();
        String subject = "License Expiry Reminder: " + license.getSoftwareName();
        String text = String.format("This is a reminder that the license for '%s' (Key: %s) is expiring on %s.",
                license.getSoftwareName(), license.getLicenseKey(), license.getValidTo());
        emailService.sendSimpleMessage(to, subject, text);
        return ResponseEntity.ok().build();
    }
}
