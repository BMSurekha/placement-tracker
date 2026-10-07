package com.placement.portal.service;

import com.placement.portal.dto.CompanyCreateUpdateDto;
import com.placement.portal.dto.CompanyDto;
import com.placement.portal.entity.Company;
import com.placement.portal.entity.PlacementDrive;
import com.placement.portal.exception.BadRequestException;
import com.placement.portal.exception.DuplicateResourceException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.CompanyRepository;
import com.placement.portal.repository.PlacementDriveRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;

    public CompanyService(CompanyRepository companyRepository, PlacementDriveRepository driveRepository) {
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
    }

    @Transactional(readOnly = true)
    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAllByOrderByNameAsc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return mapToDto(company);
    }

    @Transactional
    public CompanyDto createCompany(CompanyCreateUpdateDto dto) {
        if (companyRepository.existsByName(dto.getName().trim())) {
            throw new DuplicateResourceException("Company with name '" + dto.getName() + "' already exists");
        }

        Company company = new Company();
        updateCompanyFields(company, dto);

        Company saved = companyRepository.save(company);
        return mapToDto(saved);
    }

    @Transactional
    public CompanyDto updateCompany(Long id, CompanyCreateUpdateDto dto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));

        // If name changed, check uniqueness
        if (!company.getName().equalsIgnoreCase(dto.getName().trim()) && companyRepository.existsByName(dto.getName().trim())) {
            throw new DuplicateResourceException("Company with name '" + dto.getName() + "' already exists");
        }

        updateCompanyFields(company, dto);
        Company updated = companyRepository.save(company);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));

        List<PlacementDrive> drives = driveRepository.findByCompanyId(id);
        if (!drives.isEmpty()) {
            throw new BadRequestException("Cannot delete company '" + company.getName() + "' because it has " + drives.size() + " active or past placement drives. Please remove or close the drives first.");
        }

        companyRepository.delete(company);
    }

    private void updateCompanyFields(Company company, CompanyCreateUpdateDto dto) {
        company.setName(dto.getName().trim());
        company.setLogo(dto.getLogo() != null ? dto.getLogo().trim() : null);
        company.setIndustry(dto.getIndustry() != null ? dto.getIndustry().trim() : null);
        company.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : null);
        company.setWebsite(dto.getWebsite() != null ? dto.getWebsite().trim() : null);
        company.setLocation(dto.getLocation() != null ? dto.getLocation().trim() : null);
    }

    public CompanyDto mapToDto(Company company) {
        CompanyDto dto = new CompanyDto();
        dto.setId(company.getId());
        dto.setName(company.getName());
        dto.setLogo(company.getLogo());
        dto.setIndustry(company.getIndustry());
        dto.setDescription(company.getDescription());
        dto.setWebsite(company.getWebsite());
        dto.setLocation(company.getLocation());
        dto.setCreatedAt(company.getCreatedAt());

        long activeCount = driveRepository.findByCompanyId(company.getId()).size();
        dto.setActiveDrivesCount(activeCount);
        return dto;
    }
}
