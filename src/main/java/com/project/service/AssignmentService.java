package com.project.service;

import com.project.dto.AssignmentDto;

public interface AssignmentService {
    AssignmentDto assignLicenseToDevice(String deviceId, String licenseKey);
    void unassignLicenseFromDevice(Long assignmentId);
}
