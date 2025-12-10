package com.project.service;

import com.project.aspect.Auditable;
import com.project.dto.AssignmentDto;
import com.project.entity.Assignment;
import com.project.entity.Device;
import com.project.entity.License;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.AssignmentRepository;
import com.project.repository.DeviceRepository;
import com.project.repository.LicenseRepository;
import org.springframework.stereotype.Service;

@Service
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final DeviceRepository deviceRepository;
    private final LicenseRepository licenseRepository;

    public AssignmentServiceImpl(AssignmentRepository assignmentRepository, DeviceRepository deviceRepository, LicenseRepository licenseRepository) {
        this.assignmentRepository = assignmentRepository;
        this.deviceRepository = deviceRepository;
        this.licenseRepository = licenseRepository;
    }

    @Override
    @Auditable(action = "Assign License")
    public AssignmentDto assignLicenseToDevice(String deviceId, String licenseKey) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with ID: " + deviceId));
        License license = licenseRepository.findById(licenseKey)
                .orElseThrow(() -> new ResourceNotFoundException("License not found with key: " + licenseKey));

        Assignment assignment = Assignment.builder()
                .device(device)
                .license(license)
                .build();

        Assignment savedAssignment = assignmentRepository.save(assignment);
        return convertToDto(savedAssignment);
    }

    @Override
    @Auditable(action = "Unassign License")
    public void unassignLicenseFromDevice(Long assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new ResourceNotFoundException("Assignment not found with ID: " + assignmentId);
        }
        assignmentRepository.deleteById(assignmentId);
    }

    private AssignmentDto convertToDto(Assignment assignment) {
        return AssignmentDto.builder()
                .assignmentId(assignment.getAssignmentId())
                .deviceId(assignment.getDevice().getDeviceId())
                .licenseKey(assignment.getLicense().getLicenseKey())
                .assignedAt(assignment.getAssignedAt())
                .build();
    }
}
