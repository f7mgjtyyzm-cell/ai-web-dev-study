
import { useEffect, useState } from 'react'
import './App.css'

type StudyRecord = {
  id: string
  content: string
  createdAt: number
}

function App() {
  const [studyNote, setStudyNote] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  const [records, setRecords] = useState<StudyRecord[]>(() => {
    const savedRecords = localStorage.getItem('study-records')
    if (!savedRecords) return []

    const parsedRecords = JSON.parse(savedRecords) as StudyRecord[]

    // 기존에 저장된 문자열 날짜 데이터도 호환
    return parsedRecords.map((record) => ({
      ...record,
      createdAt:
          typeof record.createdAt === 'number'
              ? record.createdAt
              : new Date(record.createdAt).getTime(),
    }))
  })

  useEffect(() => {
    localStorage.setItem('study-records', JSON.stringify(records))
  }, [records])

  // 기록 수정
  const handleEdit = (id: string) => {
    const targetRecord = records.find((record) => record.id === id)

    if (!targetRecord) return

    setStudyNote(targetRecord.content)
    setEditingId(targetRecord.id)
  }

  // 기록 저장
  const handleSave = () => {
    const content = studyNote.trim()

    if (!content) return

    if (editingId) {
      setRecords((previousRecords) =>
          previousRecords.map((record) =>
              record.id === editingId ? { ...record, content } : record,
          ),
      )

      setStudyNote('')
      setEditingId(null)
      return
    }

    const newRecord: StudyRecord = {
      id: crypto.randomUUID(),
      content,
      createdAt: Date.now(),
    }

    setRecords((previousRecords) => [newRecord, ...previousRecords])
    setStudyNote('')
  }

  // 기록 삭제
  const handleDelete = (id: string) => {
    const confirmed = window.confirm('이 학습 기록을 삭제할까요?')

    if (!confirmed) return

    setRecords((previousRecords) =>
        previousRecords.filter((record) => record.id !== id),
    )
  }

  // 날짜 표시
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 검색
  const filteredRecords = records.filter((record) =>
      record.content.toLowerCase().includes(searchKeyword.toLowerCase()),
  )

  // 정렬
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortOrder === 'newest') {
      return b.createdAt - a.createdAt
    }

    return a.createdAt - b.createdAt
  })

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
              {editingId ? '수정 내용 저장하기 →' : '기록 저장하기 →'}
            </button>

            {editingId && (
                <button
                    type="button"
                    onClick={() => {
                      setStudyNote('')
                      setEditingId(null)
                    }}
                >
                  수정 취소
                </button>
            )}
          </div>
        </section>

        <section className="records-section">
          <div className="records-heading">
            <div>
              <p className="eyebrow">나의 성장 기록</p>
              <h2>학습 기록 모아보기</h2>
            </div>

            <span className="record-count">
            {records.length}개의 기록
          </span>
          </div>

          <div>
            <input
                type="text"
                placeholder="학습 내용 검색하기..."
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
            />

            <select
                value={sortOrder}
                onChange={(event) =>
                    setSortOrder(event.target.value as 'newest' | 'oldest')
                }
            >
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>

          {records.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">✎</span>
                <p>아직 작성한 기록이 없어요.</p>
                <span>오늘 배운 내용을 첫 번째로 기록해 보세요!</span>
              </div>
          ) : sortedRecords.length === 0 ? (
              <div className="empty-state">
                <p>검색 결과가 없어요.</p>
                <span>다른 검색어를 입력해 보세요!</span>
              </div>
          ) : (
              <div className="records-list">
                {sortedRecords.map((record) => (
                    <article className="record-item" key={record.id}>
                      <div className="record-icon">✦</div>

                      <div className="record-body">
                        <time>{formatDate(record.createdAt)}</time>
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

                      <button
                          className="edit-button"
                          onClick={() => handleEdit(record.id)}
                          aria-label="학습 기록 수정"
                          title="기록 수정"
                      >
                        수정
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
