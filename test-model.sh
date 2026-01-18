#!/bin/bash

# Test script for the Rock vs Mine ML model

echo "======================================"
echo "Testing Rock vs Mine ML Model"
echo "======================================"
echo ""

# Check if Python dependencies are installed
echo "1. Checking Python dependencies..."
if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found. Run 'npm run setup:python' first."
    exit 1
fi

.venv/bin/python3 -c "import pandas, numpy, sklearn, joblib" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ Python dependencies not installed correctly."
    exit 1
fi
echo "✅ Python dependencies OK"
echo ""

# Check if data files exist
echo "2. Checking data files..."
if [ ! -f "server/sonar.csv" ]; then
    echo "❌ Training data file (server/sonar.csv) not found."
    exit 1
fi
echo "✅ Training data file exists"

if [ ! -f "server/sonar_samples.txt" ]; then
    echo "❌ Samples file (server/sonar_samples.txt) not found."
    exit 1
fi
echo "✅ Samples file exists"
echo ""

# Test prediction with a Rock sample
echo "3. Testing prediction with Rock sample..."
ROCK_RESULT=$(echo '{"features":[0.0200,0.0371,0.0428,0.0207,0.0954,0.0986,0.1539,0.1601,0.3109,0.2111,0.1609,0.1582,0.2238,0.0645,0.0660,0.2273,0.3100,0.2999,0.5078,0.4797,0.5783,0.5071,0.4328,0.5550,0.6711,0.6415,0.7104,0.8080,0.6791,0.3857,0.1307,0.2604,0.5121,0.7547,0.8537,0.8507,0.6692,0.6097,0.4943,0.2744,0.0510,0.2834,0.2825,0.4256,0.2641,0.1386,0.1051,0.1343,0.0383,0.0324,0.0232,0.0027,0.0065,0.0159,0.0072,0.0167,0.0180,0.0084,0.0090,0.0032]}' | .venv/bin/python3 server/predict.py 2>/dev/null)

if echo "$ROCK_RESULT" | grep -q '"result"'; then
    echo "✅ Rock prediction successful"
    echo "   Result: $ROCK_RESULT"
else
    echo "❌ Rock prediction failed"
    echo "   Output: $ROCK_RESULT"
    exit 1
fi
echo ""

# Test prediction with a Mine sample
echo "4. Testing prediction with Mine sample..."
MINE_RESULT=$(echo '{"features":[0.0100,0.0171,0.0623,0.0205,0.0205,0.0368,0.1098,0.1276,0.0598,0.1264,0.0881,0.1992,0.0184,0.2261,0.1729,0.2131,0.0693,0.2281,0.4060,0.3973,0.2741,0.3690,0.5556,0.4846,0.3140,0.5334,0.5256,0.2520,0.2090,0.3559,0.6260,0.7340,0.6120,0.3497,0.3953,0.3012,0.5408,0.8814,0.9857,0.9167,0.6121,0.5006,0.3210,0.3202,0.4295,0.3654,0.2655,0.1576,0.0681,0.0294,0.0241,0.0121,0.0036,0.0150,0.0085,0.0073,0.0050,0.0044,0.0040,0.0117]}' | .venv/bin/python3 server/predict.py 2>/dev/null)

if echo "$MINE_RESULT" | grep -q '"result"'; then
    echo "✅ Mine prediction successful"
    echo "   Result: $MINE_RESULT"
else
    echo "❌ Mine prediction failed"
    echo "   Output: $MINE_RESULT"
    exit 1
fi
echo ""

# Check if model was saved
echo "5. Checking model persistence..."
if [ -f "server/model.pkl" ]; then
    echo "✅ Model file saved successfully"
else
    echo "❌ Model file not saved"
    exit 1
fi
echo ""

echo "======================================"
echo "✅ All tests passed!"
echo "======================================"
echo ""
echo "The ML model is working correctly and ready to use."
echo "You can now run 'npm run dev' to start the application."
