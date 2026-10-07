package com.placement.portal.repository;

import com.placement.portal.entity.DriveStatus;
import com.placement.portal.entity.PlacementDrive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {
    List<PlacementDrive> findAllByOrderByCreatedAtDesc();
    List<PlacementDrive> findByStatus(DriveStatus status);
    List<PlacementDrive> findByCompanyId(Long companyId);
    long countByStatus(DriveStatus status);
}
