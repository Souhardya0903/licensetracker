package com.project.dto;

import com.project.entity.LicenseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LicenseDto {
    private String licenseKey;
    private String softwareName;
    private Integer vendorId;
    private LocalDate validFrom;
    private LocalDate validTo;
    private LicenseType licenseType;
    private int maxUsage;
    private long currentUsage;
    private String notes;
    private BigDecimal renewalCost;
}
