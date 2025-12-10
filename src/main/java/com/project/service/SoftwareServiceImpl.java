/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.stereotype.Service
 */
package com.project.service;

import com.project.entity.Software;
import com.project.repository.SoftwareRepository;
import com.project.service.SoftwareService;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SoftwareServiceImpl
implements SoftwareService {
    private final SoftwareRepository softwareRepository;

    public SoftwareServiceImpl(SoftwareRepository softwareRepository) {
        this.softwareRepository = softwareRepository;
    }

    @Override
    public List<Software> getAllSoftware() {
        return this.softwareRepository.findAll();
    }

    @Override
    public Software createSoftware(Software software) {
        return (Software)this.softwareRepository.save(software);
    }
}
