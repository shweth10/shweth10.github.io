# LensReport — Encryption Declaration

**Date:** 2026-03-18
**Platform:** Apple App Store + Google Play

## Apple App Store Connect

**Does your app use encryption?** Yes

**Exemption basis:** The app uses HTTPS/TLS (AES-256) for data in transit
to communicate with AWS API Gateway and Firebase. This qualifies for the
standard encryption exemption under U.S. Export Administration Regulations
(EAR) Category 5, Part 2, Note 4.

**ERN (Encryption Registration Number):** Not required. Standard HTTPS/TLS
usage is exempt from ERN filing.

No proprietary encryption algorithms are used. All encryption is provided
by standard platform libraries (iOS Security framework, Android Keystore).

## Google Play

No additional encryption compliance declaration is required for Google Play.
The Data Safety section accurately declares that data is encrypted in transit.

## Summary

| Question | Answer |
|----------|--------|
| Uses encryption? | Yes (HTTPS/TLS only) |
| Proprietary encryption? | No |
| Qualifies for exemption? | Yes (standard HTTPS exemption) |
| ERN filing needed? | No |
