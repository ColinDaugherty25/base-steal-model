package api

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/httprate"

	"basestealmodel/backend/internal/db"
	"basestealmodel/backend/internal/decision"
)

// Server holds everything a request handler needs -- the in-memory
// decision tables/model (loaded once at startup, see decision.LoadAll)
// plus a live DB handle for player search.
type Server struct {
	Tables  decision.Tables
	Model   *decision.Model
	Medians decision.Medians
	Queries db.Querier
}

func NewRouter(s *Server, corsOrigin string) http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(securityHeaders)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{corsOrigin},
		AllowedMethods: []string{"GET", "POST"},
		AllowedHeaders: []string{"Content-Type"},
	}))
	// Generous per-IP ceiling -- player search fires on every debounced
	// keystroke, so this needs headroom for fast typing, not just a
	// single predict click. Still a real backstop against scripted abuse.
	r.Use(httprate.LimitByIP(120, time.Minute))

	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
	r.Get("/api/players/search", s.handlePlayerSearch)
	r.Post("/api/predict", s.handlePredict)

	return r
}

// securityHeaders sets response headers relevant to a JSON API -- there's
// no HTML/framing surface here, so this is narrower than the frontend's
// CSP, just the headers that matter for a pure API response.
func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		next.ServeHTTP(w, r)
	})
}
