/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.stereotype.Repository
 */
package com.project.repository;

import com.project.entity.SoftwareVersion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoftwareVersionRepository
extends JpaRepository<SoftwareVersion, Long> {
    public List<SoftwareVersion> findByDevice_DeviceId(String var1);
}
