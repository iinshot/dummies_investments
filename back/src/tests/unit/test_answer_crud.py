import pytest
from crud import answer

class TestAnswerCRUD:
    @pytest.mark.asyncio
    async def test_create_answer(self, db_session, test_question):
        """Тест создания ответа"""
        data = await answer.create_answer(
            session=db_session,
            id_question=test_question.id_question,
            answer_text="This is a test answer",
            is_correct=True
        )

        assert data.id_answer is not None
        assert data.id_question == test_question.id_question
        assert data.answer_text == "This is a test answer"
        assert data.is_correct is True

    @pytest.mark.asyncio
    async def test_get_answer(self, db_session, test_answer):
        """Тест получения ответа по ID"""
        data = await answer.get_answer(db_session, test_answer.id_answer)

        assert data is not None
        assert data.id_answer == test_answer.id_answer
        assert data.answer_text == test_answer.answer_text
        assert data.is_correct == test_answer.is_correct

    @pytest.mark.asyncio
    async def test_get_all_answers(self, db_session, test_question):
        """Тест получения всех ответов"""
        await answer.create_answer(
            session=db_session,
            id_question=test_question.id_question,
            answer_text="First answer",
            is_correct=True
        )

        await answer.create_answer(
            session=db_session,
            id_question=test_question.id_question,
            answer_text="Second answer",
            is_correct=False
        )

        answers = await answer.get_all_answers(db_session)

        assert len(answers) >= 2
        assert any(a.answer_text == "First answer" for a in answers)
        assert any(a.answer_text == "Second answer" for a in answers)

    @pytest.mark.asyncio
    async def test_update_answer(self, db_session, test_answer):
        """Тест обновления ответа"""
        updated_answer = await answer.update_answer(
            db_session,
            test_answer.id_answer,
            answer_text="Updated answer text",
            is_correct=False
        )

        assert updated_answer is not None
        assert updated_answer.answer_text == "Updated answer text"
        assert updated_answer.is_correct is False

    @pytest.mark.asyncio
    async def test_delete_answer(self, db_session, test_answer):
        """Тест удаления ответа"""
        result = await answer.delete_answer(db_session, test_answer.id_answer)
        deleted_answer = await answer.get_answer(db_session, test_answer.id_answer)

        assert result is True
        assert deleted_answer is None