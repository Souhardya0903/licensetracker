/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.data.domain.Page
 *  org.springframework.data.domain.Pageable
 *  org.springframework.data.jpa.repository.JpaRepository
 *  org.springframework.data.jpa.repository.Query
 *  org.springframework.stereotype.Repository
 */
package com.project.repository;

import com.project.entity.Device;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository
extends JpaRepository<Device, String> {
    public Page<Device> findByLocationContaining(String var1, Pageable var2);

    @Query(value="SELECT d FROM Device d WHERE d.assignments IS EMPTY")
    public List<Device> findDevicesWithNoAssignments();
}
