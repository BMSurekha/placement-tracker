package com.placement.portal.util;

import com.placement.portal.entity.*;
import com.placement.portal.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           CompanyRepository companyRepository,
                           PlacementDriveRepository driveRepository,
                           ApplicationRepository applicationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded with demo accounts and data.");
            return;
        }

        logger.info("Initializing demo seed data...");

        // 1. Create Placement Officer Demo Account
        User officerUser = new User();
        officerUser.setEmail("admin@example.com");
        officerUser.setPassword(passwordEncoder.encode("Admin@123"));
        officerUser.setRole(Role.ROLE_OFFICER);
        userRepository.save(officerUser);

        // 2. Create 5 Student Demo Accounts
        // Primary student
        User student1User = new User();
        student1User.setEmail("student@example.com");
        student1User.setPassword(passwordEncoder.encode("Student@123"));
        student1User.setRole(Role.ROLE_STUDENT);
        userRepository.save(student1User);

        Student student1 = new Student();
        student1.setUser(student1User);
        student1.setStudentId("21CS001");
        student1.setFullName("John Doe");
        student1.setPhone("9876543210");
        student1.setDepartment("CSE");
        student1.setYear(4);
        student1.setCgpa(8.5);
        student1.setBacklogs(0);
        student1.setTenthPercentage(92.5);
        student1.setIntermediatePercentage(89.0);
        student1.setSkills("Java, Spring Boot, MySQL, React, JavaScript, Git");
        student1.setResumeUrl("https://example.com/resumes/john_doe.pdf");
        studentRepository.save(student1);

        // Student 2 - Priya Sharma (IT)
        User student2User = new User();
        student2User.setEmail("priya.sharma@example.com");
        student2User.setPassword(passwordEncoder.encode("Student@123"));
        student2User.setRole(Role.ROLE_STUDENT);
        userRepository.save(student2User);

        Student student2 = new Student();
        student2.setUser(student2User);
        student2.setStudentId("21IT015");
        student2.setFullName("Priya Sharma");
        student2.setPhone("9876543211");
        student2.setDepartment("IT");
        student2.setYear(4);
        student2.setCgpa(7.8);
        student2.setBacklogs(0);
        student2.setTenthPercentage(88.0);
        student2.setIntermediatePercentage(85.5);
        student2.setSkills("Python, Django, SQL, React, HTML, CSS");
        studentRepository.save(student2);

        // Student 3 - Rohit Verma (ECE with 1 backlog)
        User student3User = new User();
        student3User.setEmail("rohit.verma@example.com");
        student3User.setPassword(passwordEncoder.encode("Student@123"));
        student3User.setRole(Role.ROLE_STUDENT);
        userRepository.save(student3User);

        Student student3 = new Student();
        student3.setUser(student3User);
        student3.setStudentId("21EC042");
        student3.setFullName("Rohit Verma");
        student3.setPhone("9876543212");
        student3.setDepartment("ECE");
        student3.setYear(4);
        student3.setCgpa(7.1);
        student3.setBacklogs(1);
        student3.setTenthPercentage(81.0);
        student3.setIntermediatePercentage(78.0);
        student3.setSkills("C, C++, Embedded Systems, Python");
        studentRepository.save(student3);

        // Student 4 - Ananya Iyer (3rd year high CGPA)
        User student4User = new User();
        student4User.setEmail("ananya.iyer@example.com");
        student4User.setPassword(passwordEncoder.encode("Student@123"));
        student4User.setRole(Role.ROLE_STUDENT);
        userRepository.save(student4User);

        Student student4 = new Student();
        student4.setUser(student4User);
        student4.setStudentId("22CS088");
        student4.setFullName("Ananya Iyer");
        student4.setPhone("9876543213");
        student4.setDepartment("CSE");
        student4.setYear(3);
        student4.setCgpa(9.2);
        student4.setBacklogs(0);
        student4.setTenthPercentage(96.0);
        student4.setIntermediatePercentage(94.0);
        student4.setSkills("Java, Data Structures, Algorithms, Docker");
        studentRepository.save(student4);

        // Student 5 - Vikram Singh (MECH with 2 backlogs)
        User student5User = new User();
        student5User.setEmail("vikram.singh@example.com");
        student5User.setPassword(passwordEncoder.encode("Student@123"));
        student5User.setRole(Role.ROLE_STUDENT);
        userRepository.save(student5User);

        Student student5 = new Student();
        student5.setUser(student5User);
        student5.setStudentId("21ME034");
        student5.setFullName("Vikram Singh");
        student5.setPhone("9876543214");
        student5.setDepartment("MECH");
        student5.setYear(4);
        student5.setCgpa(6.8);
        student5.setBacklogs(2);
        student5.setTenthPercentage(75.0);
        student5.setIntermediatePercentage(72.0);
        student5.setSkills("AutoCAD, SolidWorks, Python");
        studentRepository.save(student5);

        // 3. Create 6 Companies (Simplified entity: id, name, logo, industry, description, website, location)
        Company tcs = new Company("Tata Consultancy Services", "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&auto=format&fit=crop&q=80", "Information Technology", "Global IT services and consulting powerhouse delivering digital transformation.", "https://www.tcs.com", "Mumbai / Pan-India");
        Company infosys = new Company("Infosys Technologies", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80", "IT & Consulting", "Next-generation digital services enabling enterprises to navigate change.", "https://www.infosys.com", "Bangalore / Pune");
        Company wipro = new Company("Wipro Limited", "https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&auto=format&fit=crop&q=80", "Cloud & Cybersecurity", "Leading technology services firm focused on cloud, AI, and cognitive computing.", "https://www.wipro.com", "Hyderabad / Bangalore");
        Company accenture = new Company("Accenture Solutions", "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=120&auto=format&fit=crop&q=80", "Management Consulting & Tech", "Delivering on the promise of technology and human ingenuity across 120 countries.", "https://www.accenture.com", "Bangalore / Gurugram");
        Company techMahindra = new Company("Tech Mahindra", "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=120&auto=format&fit=crop&q=80", "Telecommunications & IT", "Specializing in digital transformation, 5G networks, and telecommunications software.", "https://www.techmahindra.com", "Pune / Noida");
        Company microsoft = new Company("Microsoft IDC", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80", "Enterprise Software & Cloud", "Empowering every person and organization to achieve more with Azure and modern tools.", "https://www.microsoft.com", "Hyderabad / Bangalore");

        companyRepository.saveAll(List.of(tcs, infosys, wipro, accenture, techMahindra, microsoft));

        // 4. Create Placement Drives with diverse eligibility scenarios
        // Scenario A: TCS Drive - Student John is ELIGIBLE & has APPLIED
        PlacementDrive drive1 = new PlacementDrive();
        drive1.setCompany(tcs);
        drive1.setJobRole("Assistant System Engineer");
        drive1.setDescription("Build and support mission-critical enterprise systems using modern cloud and backend technologies.");
        drive1.setCtc(4.5);
        drive1.setLocation("Pan India");
        drive1.setDriveDate(LocalDate.now().plusDays(20));
        drive1.setApplicationDeadline(LocalDate.now().plusDays(10));
        drive1.setStatus(DriveStatus.OPEN);

        EligibilityCriteria ec1 = new EligibilityCriteria();
        ec1.setMinimumCgpa(6.5);
        ec1.setMaximumBacklogs(1);
        ec1.setAllowedDepartments("CSE,IT,ECE");
        ec1.setAllowedYears("4");
        ec1.setMinimumTenthPercentage(60.0);
        ec1.setMinimumIntermediatePercentage(60.0);
        ec1.setRequiredSkills("Java, SQL");
        drive1.setEligibilityCriteria(ec1);
        driveRepository.save(drive1);

        // Scenario B: Infosys Drive - Student John is ELIGIBLE & SHORTLISTED
        PlacementDrive drive2 = new PlacementDrive();
        drive2.setCompany(infosys);
        drive2.setJobRole("Specialist Programmer");
        drive2.setDescription("High-impact algorithmic engineering role working on core cloud microservices and analytics.");
        drive2.setCtc(9.5);
        drive2.setLocation("Bangalore / Pune");
        drive2.setDriveDate(LocalDate.now().plusDays(25));
        drive2.setApplicationDeadline(LocalDate.now().plusDays(15));
        drive2.setStatus(DriveStatus.OPEN);

        EligibilityCriteria ec2 = new EligibilityCriteria();
        ec2.setMinimumCgpa(7.5);
        ec2.setMaximumBacklogs(0);
        ec2.setAllowedDepartments("CSE,IT");
        ec2.setAllowedYears("4");
        ec2.setMinimumTenthPercentage(70.0);
        ec2.setMinimumIntermediatePercentage(70.0);
        ec2.setRequiredSkills("Java, React");
        drive2.setEligibilityCriteria(ec2);
        driveRepository.save(drive2);

        // Scenario C: Accenture Drive - Student John is ELIGIBLE & SELECTED
        PlacementDrive drive3 = new PlacementDrive();
        drive3.setCompany(accenture);
        drive3.setJobRole("Advanced Application Engineering Analyst");
        drive3.setDescription("Develop scalable cloud solutions, APIs, and microservices for global Fortune 500 clients.");
        drive3.setCtc(6.5);
        drive3.setLocation("Bangalore / Gurugram");
        drive3.setDriveDate(LocalDate.now().plusDays(18));
        drive3.setApplicationDeadline(LocalDate.now().plusDays(8));
        drive3.setStatus(DriveStatus.OPEN);

        EligibilityCriteria ec3 = new EligibilityCriteria();
        ec3.setMinimumCgpa(7.0);
        ec3.setMaximumBacklogs(0);
        ec3.setAllowedDepartments("CSE,IT,ECE");
        ec3.setAllowedYears("4");
        ec3.setMinimumTenthPercentage(65.0);
        ec3.setMinimumIntermediatePercentage(65.0);
        ec3.setRequiredSkills("Java");
        drive3.setEligibilityCriteria(ec3);
        driveRepository.save(drive3);

        // Scenario D: Microsoft IDC Drive - Student John is ELIGIBLE (has not applied yet, RECOMMENDED!)
        PlacementDrive drive4 = new PlacementDrive();
        drive4.setCompany(microsoft);
        drive4.setJobRole("Software Development Engineer");
        drive4.setDescription("Design, build and optimize hyper-scale cloud platforms, distributed systems, and developer tools.");
        drive4.setCtc(18.0);
        drive4.setLocation("Hyderabad");
        drive4.setDriveDate(LocalDate.now().plusDays(30));
        drive4.setApplicationDeadline(LocalDate.now().plusDays(14));
        drive4.setStatus(DriveStatus.OPEN);

        EligibilityCriteria ec4 = new EligibilityCriteria();
        ec4.setMinimumCgpa(8.0);
        ec4.setMaximumBacklogs(0);
        ec4.setAllowedDepartments("CSE,IT");
        ec4.setAllowedYears("4");
        ec4.setMinimumTenthPercentage(85.0);
        ec4.setMinimumIntermediatePercentage(85.0);
        ec4.setRequiredSkills("Java, Git");
        drive4.setEligibilityCriteria(ec4);
        driveRepository.save(drive4);

        // Scenario E: Wipro Drive - Student John is NOT ELIGIBLE due to high CGPA cutoff (8.8 required vs 8.5 actual)
        PlacementDrive drive5 = new PlacementDrive();
        drive5.setCompany(wipro);
        drive5.setJobRole("Turbo Full Stack Architect");
        drive5.setDescription("Elite accelerated track for top academic performers focusing on cloud microservices.");
        drive5.setCtc(7.5);
        drive5.setLocation("Hyderabad / Bangalore");
        drive5.setDriveDate(LocalDate.now().plusDays(22));
        drive5.setApplicationDeadline(LocalDate.now().plusDays(12));
        drive5.setStatus(DriveStatus.OPEN);

        EligibilityCriteria ec5 = new EligibilityCriteria();
        ec5.setMinimumCgpa(8.8); // Higher than 8.5!
        ec5.setMaximumBacklogs(0);
        ec5.setAllowedDepartments("CSE,IT");
        ec5.setAllowedYears("4");
        ec5.setMinimumTenthPercentage(80.0);
        ec5.setMinimumIntermediatePercentage(80.0);
        ec5.setRequiredSkills("Java, MySQL");
        drive5.setEligibilityCriteria(ec5);
        driveRepository.save(drive5);

        // Scenario F: Tech Mahindra Drive - Student John is NOT ELIGIBLE due to Department (ECE only vs CSE)
        PlacementDrive drive6 = new PlacementDrive();
        drive6.setCompany(techMahindra);
        drive6.setJobRole("5G Network Automation Engineer");
        drive6.setDescription("Design next-gen cellular core network protocols, software-defined radios, and hardware telemetry.");
        drive6.setCtc(5.5);
        drive6.setLocation("Pune / Noida");
        drive6.setDriveDate(LocalDate.now().plusDays(15));
        drive6.setApplicationDeadline(LocalDate.now().plusDays(7));
        drive6.setStatus(DriveStatus.OPEN);

        EligibilityCriteria ec6 = new EligibilityCriteria();
        ec6.setMinimumCgpa(6.5);
        ec6.setMaximumBacklogs(0);
        ec6.setAllowedDepartments("ECE"); // Only ECE!
        ec6.setAllowedYears("4");
        ec6.setMinimumTenthPercentage(60.0);
        ec6.setMinimumIntermediatePercentage(60.0);
        ec6.setRequiredSkills("C, C++");
        drive6.setEligibilityCriteria(ec6);
        driveRepository.save(drive6);

        // 5. Seed diverse Applications across different students
        // John Doe -> TCS (Assistant System Engineer)
        Application app1 = new Application();
        app1.setStudent(student1);
        app1.setPlacementDrive(drive1);
        app1.setStatus(ApplicationStatus.APPLIED);
        app1.setRemarks("Application submitted successfully. Awaiting online assessment slot.");

        // Priya Sharma -> Infosys (Specialist Programmer)
        Application app2 = new Application();
        app2.setStudent(student2);
        app2.setPlacementDrive(drive2);
        app2.setStatus(ApplicationStatus.SHORTLISTED);
        app2.setRemarks("Cleared coding round! Technical interview scheduled for next week.");

        // Rohit Verma -> TCS (Assistant System Engineer)
        Application app3 = new Application();
        app3.setStudent(student3);
        app3.setPlacementDrive(drive1);
        app3.setStatus(ApplicationStatus.APPLIED);
        app3.setRemarks("Application submitted for Assistant System Engineer.");

        // Ananya Iyer -> Microsoft IDC (Software Development Engineer)
        Application app4 = new Application();
        app4.setStudent(student4);
        app4.setPlacementDrive(drive4);
        app4.setStatus(ApplicationStatus.SELECTED);
        app4.setRemarks("Congratulations! Selected for Software Development Engineer (18.0 LPA).");

        applicationRepository.saveAll(List.of(app1, app2, app3, app4));

        logger.info("Demo data initialization complete!");
        logger.info("Student login: student@example.com / Student@123");
        logger.info("Placement Officer login: admin@example.com / Admin@123");
    }
}
