# Requirements Document

## Introduction

This feature transforms the SafePin application from a user-centric model to an anonymous-first public service model. The core functionality—incident reporting—will be accessible to everyone without requiring account creation, while maintaining secure access for Authority and Admin users to manage reports within their jurisdictions.

## Requirements

### Requirement 1: Anonymous Report Submission

**User Story:** As a member of the public, I want to submit incident reports without creating an account, so that I can quickly report emergencies or incidents without barriers.

#### Acceptance Criteria

1. WHEN a user visits the report page THEN the system SHALL allow report submission without authentication
2. WHEN a user submits a report THEN the system SHALL generate a unique tracking code for the report
3. WHEN a report is submitted THEN the system SHALL store the report without requiring a user_id
4. WHEN a report is successfully submitted THEN the system SHALL display the tracking code to the user
5. WHEN a user uploads an image with their report THEN the system SHALL rename the image file to match the tracking code

### Requirement 2: Report Tracking System

**User Story:** As an anonymous reporter, I want to track the status of my submitted report using a tracking code, so that I can follow up on the incident without needing an account.

#### Acceptance Criteria

1. WHEN a user visits the tracking page THEN the system SHALL provide an interface to enter a tracking code
2. WHEN a user enters a valid tracking code THEN the system SHALL display the report status and basic details
3. WHEN a user enters an invalid tracking code THEN the system SHALL display an appropriate error message
4. WHEN displaying report status THEN the system SHALL show current status, submission date, and jurisdiction assignment

### Requirement 3: Spam Prevention

**User Story:** As a system administrator, I want to prevent spam and bot submissions, so that the reporting system maintains data quality and prevents abuse.

#### Acceptance Criteria

1. WHEN a user submits a report THEN the system SHALL require reCAPTCHA v3 verification
2. WHEN reCAPTCHA verification fails THEN the system SHALL reject the report submission
3. WHEN reCAPTCHA verification succeeds THEN the system SHALL proceed with report processing
4. WHEN the backend receives a report THEN the system SHALL verify the reCAPTCHA token with Google's API before storing

### Requirement 4: Simplified Authentication

**User Story:** As an Authority or Admin user, I want to access the management dashboard through a dedicated login system, so that I can manage reports within my jurisdiction.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL remove public sign-up functionality
2. WHEN a user visits the homepage THEN the system SHALL only display login option for authorized users
3. WHEN an Authority or Admin user logs in THEN the system SHALL fetch their profile including role and jurisdiction
4. WHEN authentication is successful THEN the system SHALL redirect to the appropriate dashboard based on role

### Requirement 5: Jurisdiction-Based Access Control

**User Story:** As an Authority user, I want to see only reports within my assigned jurisdiction, so that I can focus on incidents I'm responsible for handling.

#### Acceptance Criteria

1. WHEN an Authority user accesses the dashboard THEN the system SHALL display only reports matching their jurisdiction
2. WHEN an Authority user attempts to access reports outside their jurisdiction THEN the system SHALL deny access
3. WHEN reports are stored THEN the system SHALL include jurisdiction information for proper filtering
4. WHEN images are accessed THEN the system SHALL enforce jurisdiction-based permissions through RLS policies

### Requirement 6: Admin User Management

**User Story:** As an Admin user, I want to create and manage Authority user accounts, so that I can control who has access to the system and assign appropriate jurisdictions.

#### Acceptance Criteria

1. WHEN an Admin accesses user management THEN the system SHALL display all existing users
2. WHEN an Admin creates a new user THEN the system SHALL allow assignment of role and jurisdiction
3. WHEN an Admin assigns jurisdiction THEN the system SHALL use Philippine Standard Geographic Code (PSGC) data
4. WHEN an Admin modifies user permissions THEN the system SHALL update the user's access immediately

### Requirement 7: Admin Report Management

**User Story:** As an Admin user, I want to manage all reports across jurisdictions, so that I can ensure proper assignment and handle moderation tasks.

#### Acceptance Criteria

1. WHEN an Admin accesses report management THEN the system SHALL display all reports regardless of jurisdiction
2. WHEN an Admin assigns jurisdiction to a report THEN the system SHALL make it visible to the appropriate Authority users
3. WHEN an Admin reassigns a report THEN the system SHALL update jurisdiction and notify relevant parties
4. WHEN an Admin deletes inappropriate reports THEN the system SHALL remove the report and associated data

### Requirement 8: Database Schema Updates

**User Story:** As a system, I need updated database schema to support anonymous reporting and jurisdiction-based access, so that the application can function with the new user model.

#### Acceptance Criteria

1. WHEN the schema is updated THEN the reports table SHALL have nullable user_id column
2. WHEN the schema is updated THEN the reports table SHALL include tracking_code column
3. WHEN the schema is updated THEN both users and reports tables SHALL include jurisdiction columns
4. WHEN existing data is migrated THEN regular users SHALL be removed while preserving their report data
5. WHEN RLS policies are updated THEN they SHALL enforce jurisdiction-based access for reports and storage