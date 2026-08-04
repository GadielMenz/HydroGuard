@echo off
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.8-hotspot"
set "PATH=%JAVA_HOME%\bin;C:\Users\STOKI\Desktop\HydroGuard-full-stack-structure\tools\apache-maven-3.9.11\bin;%PATH%"
cd /d "C:\Users\STOKI\Desktop\HydroGuard-full-stack-structure\backend"
"C:\Users\STOKI\Desktop\HydroGuard-full-stack-structure\tools\apache-maven-3.9.11\bin\mvn.cmd" spring-boot:run > "C:\Users\STOKI\Desktop\HydroGuard-full-stack-structure\logs\backend.log" 2> "C:\Users\STOKI\Desktop\HydroGuard-full-stack-structure\logs\backend.err.log"
