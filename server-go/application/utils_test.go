package application

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestPgTimestampFormat(t *testing.T) {

	date := "2020-01-01 08:01:20"

	parse_time, err := time.Parse(PgTimestampFormat, date)

	assert.NoError(t, err)

	assert.Equal(t, parse_time, time.Time(time.Date(2020, time.January, 1, 8, 1, 20, 0, time.UTC)))
}
