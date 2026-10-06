-- Deployment prerequisite: verify existing member phone/email values are unique
-- within each organization before applying this migration.
CREATE UNIQUE INDEX "members_organizationId_phone_key" ON "members"("organizationId", "phone");
CREATE UNIQUE INDEX "members_organizationId_email_key" ON "members"("organizationId", "email");
