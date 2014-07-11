cd "C:\dev\applications\tomcat\apache-tomcat-7.0.54\webapps\twitterCl" 
del *.* /F /Q
xcopy "C:\dev\repositories\git\twitterlite\twitterCl" "C:\dev\applications\tomcat\apache-tomcat-7.0.54\webapps\twitterCl" /D /E /C /R /I /K /Y
xcopy "C:\dev\repositories\twitterlite\twitterCl" "C:\dev\applications\tomcat\apache-tomcat-7.0.54\webapps\twitterCl" /D /E /C /R /I /K /Y