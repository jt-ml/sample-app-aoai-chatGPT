@echo off

@REM echo.
@REM echo Restoring backend python packages
@REM echo.
@REM call python -m pip install -r requirements.txt
@REM if "%errorlevel%" neq "0" (
@REM     echo Failed to restore backend python packages
@REM     exit /B %errorlevel%
@REM )

@REM echo.
@REM echo Restoring frontend npm packages
@REM echo.
@REM cd frontend
@REM call npm install
@REM if "%errorlevel%" neq "0" (
@REM     echo Failed to restore frontend npm packages
@REM     exit /B %errorlevel%
@REM )

echo.
echo Building frontend
echo.
cd frontend
call npm run build
if "%errorlevel%" neq "0" (
    echo Failed to build frontend
    exit /B %errorlevel%
)

echo.
echo Starting backend
echo.
cd ..
@REM start http://127.0.0.1:5000
@REM call python ./app.py
start http://127.0.0.1:50505
call python -m uvicorn app:app  --port 50505 --reload
if "%errorlevel%" neq "0" (
    echo Failed to start backend
    exit /B %errorlevel%
)
