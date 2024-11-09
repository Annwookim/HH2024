// server.js
import express from 'express';
import axios from 'axios';
import path from 'path';

//import { GOOGLE_API_KEY, OPENAI_API_KEY } from '/Users/kim222w/Downloads/HackH/config.js';


const app = express();
app.use(express.json());
const __dirname = path.resolve();


// Serve static files from the project directory
app.use(express.static(__dirname));

// Route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
 
app.post('/chat', async (req, res) => {
    const location = req.body.location;

    if (!location || !location.name || !location.imageUrl) {
        return res.status(400).json({ error: 'Location details are required' });
    }

    const prompt = `Suggest a visit to ${location.name}. Mention it is a scenic and calming place. Here’s a Street View image: ${location.imageUrl}`;

    try {
        const openAIResponse = await axios.post('https://api.openai.com/v1/completions', {
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 100
        }, {
            headers: { Authorization: `Bearer ${"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"
}` }
        });

        res.json({
            text: openAIResponse.data.choices[0].text.trim(),
            imageUrl: location.imageUrl
        });
    } catch (error) {
        res.status(500).send("Error communicating with OpenAI API");
    }
});


app.post('/street-view', (req, res) => {
    const { lat, lng } = req.body;
    const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&fov=90&heading=235&pitch=10&key=${"AIzaSyD04wdUmPdhktcPGDyqTOpBNx9qJSE0JC4"}`;
    res.json({ streetViewUrl });
});

app.listen(3001, () => {
    console.log('Server running at http://localhost:3001');
});


