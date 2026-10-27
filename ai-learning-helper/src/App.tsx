
import { useEffect, useState } from 'react'
import './App.css'

type StudyRecord = {
  id: string
  content: string
  createdAt: string
}

function App() {
  const [studyNote, setStudyNote] = useState('')
  const [records, setRecords] = useState<StudyRecord[]>(() => {
    const savedRecords = localStorage.getItem('study-records')
    return savedRecords ? JSON.parse(savedRecords) as StudyRecord[] : []
  })

  useEffect(() => {
    localStorage.setItem('study-records', JSON.stringify(records))
  }, [records])

  const handleSave = () => {
    const content = studyNote.trim()

    if (!content) return

    const newRecord: StudyRecord = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setRecords((previousRecords) => [newRecord, ...previousRecords])
    setStudyNote('')
  }

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('이 학습 기록을 삭제할까요?')

    if (!confirmed) return

    setRecords((previousRecords) =>
        previousRecords.filter((record) => record.id !== id),
    )
  }

  return (
      <main className="app">
        <header className="header">
          <span className="logo">✦ 나의 AI 공부방</span>
          <span className="tag">나만의 학습 공간</span>
        </header>

        <section className="hero">
          <p className="eyebrow">AI 학습 도우미</p>
          <h1>
            오늘 배운 것을
            <br />
            내 것으로 만들기
          </h1>
          <p className="description">
            오늘 공부한 내용을 기록해 봐.
            <br />
            차곡차곡 쌓인 기록이 너만의 지식이 될 거야.
          </p>
        </section>

        <section className="note-card">
          <label htmlFor="study-note">오늘 무엇을 배웠나요?</label>
          <p className="hint">
            새롭게 알게 된 점이나 기억하고 싶은 내용을 적어 줘.
          </p>

          <textarea
              id="study-note"
              value={studyNote}
              onChange={(event) => setStudyNote(event.target.value)}
              placeholder="예: JSX는 JavaScript 안에서 HTML과 비슷한 문법으로 화면을 만들 수 있게 해준다."
              rows={7}
          />

          <div className="note-footer">
            <span>{studyNote.length}자 입력했어요</span>
            <button onClick={handleSave} disabled={!studyNote.trim()}>
              기록 저장하기 →
            </button>
          </div>
        </section>

        <section className="records-section">
          <div className="records-heading">
            <div>
              <p className="eyebrow">나의 성장 기록</p>
              <h2>학습 기록 모아보기</h2>
            </div>
            <span className="record-count">{records.length}개의 기록</span>
          </div>

          {records.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">✎</span>
                <p>아직 작성한 기록이 없어요.</p>
                <span>오늘 배운 내용을 첫 번째로 기록해 보세요!</span>
              </div>
          ) : (
              <div className="records-list">
                {records.map((record) => (
                    <article className="record-item" key={record.id}>
                      <div className="record-icon">✦</div>
                      <div className="record-body">
                        <time>{record.createdAt}</time>
                        <p>{record.content}</p>
                      </div>
                      <button
                          className="delete-button"
                          onClick={() => handleDelete(record.id)}
                          aria-label="학습 기록 삭제"
                          title="기록 삭제"
                      >
                        삭제
                      </button>
                    </article>
                ))}
              </div>
          )}
        </section>

        <footer className="footer">
          매일 조금씩, 꾸준히 성장하기
        </footer>
      </main>
  )
}

export default App
