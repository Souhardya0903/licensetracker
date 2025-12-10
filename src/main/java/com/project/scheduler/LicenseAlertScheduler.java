/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.scheduling.annotation.Scheduled
 *  org.springframework.stereotype.Component
 */
package com.project.scheduler;

import com.project.entity.License;
import com.project.repository.LicenseRepository;
import java.time.LocalDate;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class LicenseAlertScheduler {
    private static final Logger log = LoggerFactory.getLogger(LicenseAlertScheduler.class);
    private final LicenseRepository licenseRepository;

    public LicenseAlertScheduler(LicenseRepository licenseRepository) {
        this.licenseRepository = licenseRepository;
    }

    @Scheduled(cron="0 0 1 * * ?")
    public void checkForExpiringLicenses() {
        log.info("--- Running Daily Check for Expiring Licenses ---");
        LocalDate thirtyDaysFromNow = LocalDate.now().plusDays(30L);
        List<License> expiringSoon = this.licenseRepository.findByValidToBefore(thirtyDaysFromNow);
        if (expiringSoon.isEmpty()) {
            log.info("No licenses are expiring in the next 30 days.");
        } else {
            log.warn("Found {} licenses expiring soon:", (Object)expiringSoon.size());
            for (License license : expiringSoon) {
                log.warn("  - License Key: {}, Software: {}, Expires On: {}", new Object[]{license.getLicenseKey(), license.getSoftwareName(), license.getValidTo()});
            }
        }
        log.info("--- Daily Check Finished ---");
    }
}
