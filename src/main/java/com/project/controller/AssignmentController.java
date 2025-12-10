package com.project.controller;

import com.project.dto.AssignmentDto;
import com.project.service.AssignmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'NETWORK_ADMIN')")
    public ResponseEntity<AssignmentDto> assignLicense(@RequestParam String deviceId, @RequestParam String licenseKey) {
        AssignmentDto assignedLicense = assignmentService.assignLicenseToDevice(deviceId, licenseKey);
        return new ResponseEntity<>(assignedLicense, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'NETWORK_ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unassignLicense(@PathVariable Long id) {
        assignmentService.unassignLicenseFromDevice(id);
    }
}
