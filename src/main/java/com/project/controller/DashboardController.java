package com.project.controller;

import com.project.dto.DashboardOverviewDto;
import com.project.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('ADMIN', 'NETWORK_ADMIN', 'PROCUREMENT_OFFICER', 'COMPLIANCE_OFFICER', 'IT_AUDITOR', 'OPERATIONS_MANAGER', 'NETWORK_ENGINEER', 'SECURITY_HEAD', 'PRODUCT_OWNER', 'COMPLIANCE_LEAD')")
    public ResponseEntity<DashboardOverviewDto> getDashboardOverview() {
        DashboardOverviewDto overview = dashboardService.getDashboardOverview();
        return ResponseEntity.ok(overview);
    }
}
