# Rock vs Mine Prediction Model

This GitHub repository contains a Machine Learning model for predicting whether an object is a rock or a mine. Leveraging a dataset of object characteristics, this project offers accurate classification capabilities.

## About

This application uses a logistic regression model trained on sonar data to classify underwater objects as either rocks or mines. The model analyzes 60 frequency bands from sonar signals to make predictions with confidence scores.

## Tech Stack

- **Backend**: Node.js with Express 5, TypeScript
- **Frontend**: React 18 with Vite, Wouter for routing, Tailwind CSS + Shadcn UI
- **Database**: PostgreSQL with Drizzle ORM
- **ML Model**: Python with scikit-learn (Logistic Regression)
- **Data Processing**: pandas, numpy

## Features

- **Predict**: Upload or manually input 60 sonar frequency bands to get rock vs mine predictions
- **Visualize**: Interactive charts showing sonar frequency patterns
- **History**: View all previous predictions with their confidence scores
- **Sample Data**: Load official sonar samples for testing

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL database
- uv (Python package manager - automatically available in Replit)

### Quick Setup (Replit)

If you're running this on Replit, the database is automatically provisioned. Just run:

```bash
npm run setup
```

This will install both Node.js and Python dependencies.

### Manual Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install all dependencies:
```bash
npm run setup
```

Or install them separately:
```bash
npm install           # Node.js dependencies
uv sync              # Python dependencies (or use npm run setup:python)
```

3. Set up environment variables (create a `.env` file if needed):
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=5000
```

4. Push database schema:
```bash
npm run db:push
```

### Verifying Installation

After installation, run the test script to verify everything works:
```bash
npm run test:model
```

This will check:
- ✅ Python dependencies are installed
- ✅ Data files exist
- ✅ Model can make predictions
- ✅ Model persistence works

Or test manually:
```bash
echo '{"features":[0.02,0.0371,0.0428,0.0207,0.0954,0.0986,0.1539,0.1601,0.3109,0.2111,0.1609,0.1582,0.2238,0.0645,0.066,0.2273,0.31,0.2999,0.5078,0.4797,0.5783,0.5071,0.4328,0.555,0.6711,0.6415,0.7104,0.808,0.6791,0.3857,0.1307,0.2604,0.5121,0.7547,0.8537,0.8507,0.6692,0.6097,0.4943,0.2744,0.051,0.2834,0.2825,0.4256,0.2641,0.1386,0.1051,0.1343,0.0383,0.0324,0.0232,0.0027,0.0065,0.0159,0.0072,0.0167,0.018,0.0084,0.009,0.0032]}' | .venv/bin/python3 server/predict.py
```

Expected output:
```json
{"result": "Rock", "confidence": 0.56}
```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The application will be available at `http://localhost:5000`

## API Endpoints

- `POST /api/predict` - Submit sonar data for prediction
- `GET /api/predictions` - Retrieve prediction history
- `GET /api/samples/random` - Get a random sonar sample

## Model Details

The machine learning model uses a Logistic Regression classifier trained on the Sonar dataset. The model:
- Takes 60 numerical features (sonar frequency bands ranging from 0.0 to 1.0)
- Outputs a classification (Rock or Mine)
- Provides confidence scores for predictions (0.0 to 1.0)
- Auto-trains on first run if no pre-trained model exists
- Saves trained model to `server/model.pkl` for faster subsequent predictions
- Uses scikit-learn 1.8.0 for reliable predictions

### How It Works

1. **Data Collection**: The sonar dataset contains 208 samples with 60 features each
2. **Training**: On first run, the model trains using 90% of data for training, 10% for testing
3. **Prediction**: When you submit sonar readings, the model analyzes the frequency pattern
4. **Classification**: Based on learned patterns, it classifies as Rock (R) or Mine (M)
5. **Confidence**: Returns probability score indicating prediction certainty

### Retraining the Model

If you want to retrain the model with fresh parameters:
```bash
rm server/model.pkl
# Next prediction will trigger automatic retraining
```

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
│   ├── predict.py   # ML prediction script
│   ├── sonar.csv    # Training dataset
│   └── routes.ts    # API routes
├── shared/          # Shared types and schemas
└── script/          # Build scripts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
