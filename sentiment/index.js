const express = require('express');
const cors = require('cors');

// Import the natural NLP library
const natural = require('natural');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// POST /sentiment  body: { "sentence": "..." }  (or ?sentence=...)
app.post('/sentiment', (req, res) => {
    const sentence = (req.body && req.body.sentence) || req.query.sentence;

    if (!sentence) {
        return res.status(400).json({ error: 'No sentence provided' });
    }

    try {
        const Analyzer = natural.SentimentAnalyzer;
        const stemmer = natural.PorterStemmer;
        const analyzer = new Analyzer('English', stemmer, 'afinn');
        const tokenizer = new natural.WordTokenizer();

        const analysisResult = analyzer.getSentiment(tokenizer.tokenize(sentence));

        let sentiment = 'neutral';
        if (analysisResult < 0) {
            sentiment = 'negative';
        } else if (analysisResult > 0.33) {
            sentiment = 'positive';
        }

        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });
    } catch (error) {
        res.status(500).json({ message: 'Error performing sentiment analysis', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Sentiment service running on port ${port}`);
});
