import { addSurveyButtonHandler as addSurveyButtonHandlerForFiles } from './src/components/fileButtonHandler.js'
import { addSurveyButtonHandler as addSurveyButtonHandlerForHunt } from './src/components/huntButtonHandler.js'
import { addSurveyButtonHandler as addSurveyButtonHandlerForOtherFiles } from './src/components/otherFileButtonHandler.js'
import { addParticipantsButtonHandler } from './src/components/participantButtonHandler.js'
import { addSurveyButtonHandler as addSurveyButtonHandlerForQuestions } from './src/components/questionButtonHandler.js'
import { addSurveyButtonHandler as addSurveyButtonHandlerForSurveys } from './src/components/surveyButtonHandler.js'
import { addModalWindow } from './src/components/addButtonHandler.js'


document.addEventListener('DOMContentLoaded', async function() {
    try {
        const API_URL = `/api/surveys/total-number`;
        const response = await fetch(API_URL);       
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();

        let menu = null;
        let button = null;

        addParticipantsButtonHandler()
        
        for (const survey of data.surveys) {
            button = document.createElement('button');
            button.className = 'dropdown-button';
            button.textContent = `Обследование ${survey.number}`;

            menu = document.querySelector(`#loadDataBtn7`).nextElementSibling;
            addSurveyButtonHandlerForFiles(button, survey.id);
            menu.appendChild(button);

            button = document.createElement('button');
            button.className = 'dropdown-button';
            button.textContent = `Обследование ${survey.number}`;

            menu = document.querySelector(`#loadDataBtn5`).nextElementSibling;
            addSurveyButtonHandlerForHunt(button, survey.id)
            menu.appendChild(button);

            button = document.createElement('button');
            button.className = 'dropdown-button';
            button.textContent = `Обследование ${survey.number}`;

            menu = document.querySelector(`#loadDataBtn4`).nextElementSibling;
            addSurveyButtonHandlerForOtherFiles(button, survey.id)
            menu.appendChild(button);

            button = document.createElement('button');
            button.className = 'dropdown-button';
            button.textContent = `Обследование ${survey.number}`;

            menu = document.querySelector(`#loadDataBtn3`).nextElementSibling;
            addSurveyButtonHandlerForQuestions(button, survey.id)
            menu.appendChild(button);

            button = document.createElement('button');
            button.className = 'dropdown-button';
            button.textContent = `Обследование ${survey.number}`;

            menu = document.querySelector(`#loadDataBtn2`).nextElementSibling;
            addSurveyButtonHandlerForSurveys(button, survey.id)
            menu.appendChild(button);

            menu = document.querySelector(`#loadDataBtn6`);
            addModalWindow(menu)
        }
    } catch (error) {
        console.error('Ошибка при загрузке количества обследований:', error);
        errorMessage.textContent = `Ошибка при загрузке списка обследований: ${error.message}`;
        errorMessage.classList.remove('hidden');
    }
});